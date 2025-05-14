import React, { useEffect, useRef, useState, useCallback } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import './Editor.css';

function Editor({ socketRef, roomId, onCodeChange, language, editorRef }) {
  const editorContainerRef = useRef(null);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);

  const handleCodeChange = useCallback(
    (code) => {
      onCodeChange(code);
      localStorage.setItem(`code-${roomId}`, code);
    },
    [onCodeChange, roomId]
  );

  useEffect(() => {
    const loadPyodideScript = async () => {
      if (language !== 'python' || pyodide) return;

      setIsPyodideLoading(true);
      try {
        const pyodideModule = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
        });
        setPyodide(pyodideModule);
      } catch (err) {
        console.error('Failed to load Pyodide:', err);
      } finally {
        setIsPyodideLoading(false);
      }
    };

    if (language === 'python' && !window.loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
      script.onload = loadPyodideScript;
      document.body.appendChild(script);
    } else {
      loadPyodideScript();
    }
  }, [language, pyodide]);

  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${roomId}`) || '';
    if (!editorRef.current) {
      editorRef.current = CodeMirror(editorContainerRef.current, {
        value: savedCode,
        mode: language === 'python' ? 'python' : 'javascript',
        theme: 'material',
        lineNumbers: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        lineWrapping: true,
        indentUnit: 4,
        tabSize: 4,
      });

      editorRef.current.on('change', (instance, changes) => {
        const code = instance.getValue();
        handleCodeChange(code);

        if (changes.origin !== 'setValue') {
          socketRef.current?.emit('code-change', {
            roomId,
            code,
          });
        }
      });

      socketRef.current?.on('code-change', ({ code }) => {
        const currentCode = editorRef.current.getValue();
        if (code !== currentCode) {
          editorRef.current.setValue(code);
        }
      });

      socketRef.current?.on('sync-code', ({ code }) => {
        if (code) editorRef.current.setValue(code);
      });
    }
  }, [socketRef, roomId, language, handleCodeChange, editorRef]);

  const runCode = async () => {
    const code = editorRef.current?.getValue() || '';
    let result = '';

    if (language === 'javascript') {
      const originalConsoleLog = console.log;
      try {
        console.log = (...args) => {
          result += args.join(' ') + '\n';
        };
        const res = eval(code);
        if (res !== undefined) result += res + '\n';
      } catch (err) {
        result = err.message;
      } finally {
        console.log = originalConsoleLog;
      }
    } else if (language === 'python') {
      if (!pyodide) {
        result = 'Python interpreter is loading...';
      } else {
        try {
          await pyodide.loadPackagesFromImports(code);
          const captureOutput = `
import sys
import io
stdout = sys.stdout
sys.stdout = io.StringIO()
try:
  exec(\"\"\"${code.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}\"\"\")
  output = sys.stdout.getvalue()
finally:
  sys.stdout = stdout
output
          `;
          result = await pyodide.runPythonAsync(captureOutput);
        } catch (err) {
          result = err.message;
        }
      }
    }

    setOutput(result?.toString().trim());
  };

  return (
    <div className="editor-container">
      <div ref={editorContainerRef} className="code-editor" style={{ height: '400px' }}></div>
      <div className="mt-3">
        <button
          onClick={runCode}
          className="btn btn-success mb-2"
          disabled={language === 'python' && (!pyodide || isPyodideLoading)}
        >
          {language === 'python' && isPyodideLoading ? 'Loading Python...' : 'Run Code'}
        </button>
        <div
          className="output-box bg-dark text-light p-3 rounded"
          style={{ minHeight: '100px', whiteSpace: 'pre-wrap' }}
        >
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default Editor;

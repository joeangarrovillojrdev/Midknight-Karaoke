import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f', color: '#fff', gap: '20px'
        }}>
          <AlertTriangle size={64} color="#ff2a5f" />
          <h1 style={{fontSize: '32px', margin: 0}}>Oops, something went wrong!</h1>
          <p style={{color: '#a0a0b0', maxWidth: '500px', textAlign: 'center'}}>
            The application encountered an unexpected error.
          </p>
          <div style={{color: '#ff4d4d', fontFamily: 'monospace', background: 'rgba(255,0,0,0.1)', padding: '16px', borderRadius: '8px', maxWidth: '80%', overflowWrap: 'break-word'}}>
            {this.state.errorMsg || 'Unknown Error'}
          </div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '12px 24px', background: 'linear-gradient(90deg, #ff2a5f, #7b2cbf)', 
              color: 'white', border: 'none', borderRadius: '99px', fontSize: '16px', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px'
            }}
          >
            <RefreshCw size={18} /> Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

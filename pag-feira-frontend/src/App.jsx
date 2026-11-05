import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">


      <RouterProvider router={router} />;
    </div>
  );
}

export default App

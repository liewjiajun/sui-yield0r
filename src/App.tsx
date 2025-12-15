import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Leaderboard } from './views/Leaderboard';
import { MyYields } from './views/MyYields';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/my-yields" element={<MyYields />} />
      </Routes>
    </Layout>
  );
}

export default App;

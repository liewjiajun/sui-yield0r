import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Layout } from './components/Layout';
import { Leaderboard } from './views/Leaderboard';
import { MyYields } from './views/MyYields';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/my-yields" element={<MyYields />} />
        </Routes>
      </Layout>
      <Analytics />
    </>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ContentList from './pages/ContentList.jsx'
import ContentForm from './pages/ContentForm.jsx'
import AdsManager from './pages/AdsManager.jsx'
import UsersList from './pages/UsersList.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="content" element={<ContentList />} />
        <Route path="content/:id" element={<ContentForm />} />
        <Route path="ads" element={<AdsManager />} />
        <Route path="users" element={<UsersList />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

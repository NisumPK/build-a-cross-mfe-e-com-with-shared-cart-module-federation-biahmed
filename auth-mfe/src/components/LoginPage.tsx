import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, logout, selectUser } from '@shared/authSlice'
import { setCookie } from '@shared/cookies'

export default function LoginPage() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Mock user
  const MOCK_USER = { id: '1', email: 'user@example.com', password: 'password', name: 'John Doe' }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      const fakeToken = btoa(JSON.stringify({ userId: MOCK_USER.id, email: MOCK_USER.email }))
      setCookie('authToken', fakeToken)
      dispatch(setUser({ id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name }))
      setEmail('')
      setPassword('')
    } else {
      setError('Invalid email or password')
    }
  }

  const handleLogout = () => {
    setCookie('authToken', '', { expires: 0 })
    dispatch(logout())
  }

  if (user) {
    return (
      <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <p>
          <strong>Welcome, {user.name}!</strong>
        </p>
        <p>Email: {user.email}</p>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: '300px', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Login</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Email:
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Password:
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </label>
      </div>

      <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Login
      </button>

      <p style={{ fontSize: '0.85em', color: '#666', marginTop: '1rem' }}>
        Demo user: <strong>user@example.com</strong> / <strong>password</strong>
      </p>
    </form>
  )
}

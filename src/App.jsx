import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function TextInput({label, type='text', value, onChange, placeholder=''}){
  return (
    <label className="block w-full">
      <span className="text-sm text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-gray-200 bg-white/60 backdrop-blur px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-lime-400"
      />
    </label>
  )
}

function Button({children, onClick, variant='primary', type='button'}){
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-lime-500 hover:bg-lime-600 text-white focus:ring-lime-300',
    ghost: 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300'
  }
  return <button type={type} onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</button>
}

function Card({children}){
  return <div className="rounded-2xl bg-white/70 backdrop-blur shadow-lg ring-1 ring-black/5 p-6">{children}</div>
}

function Navbar(){
  const nav = useNavigate()
  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>nav('/')}> 
          <div className="h-8 w-8 rounded-lg bg-lime-500"></div>
          <span className="text-xl font-bold">fruito</span>
        </div>
        <div className="flex items-center gap-3">
          <Link className="text-gray-700 hover:text-black" to="/shop">Shop</Link>
          <Link className="text-gray-700 hover:text-black" to="/login">Login</Link>
          <Link className="text-gray-700 hover:text-black" to="/signup">Sign up</Link>
          <Link className="text-gray-700 hover:text-black" to="/admin">Admin</Link>
        </div>
      </div>
    </div>
  )
}

function Layout({children}){
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50 text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
      <footer className="text-center text-sm text-gray-500 py-10">© {new Date().getFullYear()} fruito</footer>
    </div>
  )
}

function Hero(){
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Fresh fruit, delivered simply.</h1>
        <p className="mt-3 text-gray-600">Clean, minimal shopping designed for speed and clarity.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/shop"><Button>Start shopping</Button></Link>
          <Link to="/signup"><Button variant='ghost'>Create account</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["🍎","🍌","🍓","🍊","🥝","🍇"].map((f,i)=> (
          <div key={i} className="aspect-square rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center text-4xl shadow ring-1 ring-black/5">{f}</div>
        ))}
      </div>
    </div>
  )
}

function useAuth(){
  const [user,setUser] = useState(()=>{
    const s = localStorage.getItem('fruito_user');
    return s? JSON.parse(s): null
  })
  const save = (u)=>{ setUser(u); localStorage.setItem('fruito_user', JSON.stringify(u)) }
  const clear = ()=>{ setUser(null); localStorage.removeItem('fruito_user') }
  return { user, save, clear }
}

function Login(){
  const {save} = useAuth()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const nav = useNavigate()
  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    try{
      const res = await fetch(`${API}/auth/user/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
      if(!res.ok){ throw new Error((await res.json()).detail || 'Login failed') }
      const data = await res.json()
      save(data)
      nav('/shop')
    }catch(err){ setError(err.message) }
  }
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <h2 className="text-2xl font-bold mb-6">User Login</h2>
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <TextInput label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
            <TextInput label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            <Button type="submit">Sign in</Button>
          </form>
          <p className="mt-4 text-sm text-gray-600">No account? <Link className="underline" to="/signup">Create one</Link></p>
        </Card>
      </div>
    </Layout>
  )
}

function Signup(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const nav = useNavigate()
  const submit = async (e)=>{
    e.preventDefault(); setError('')
    try{
      const res = await fetch(`${API}/auth/user/signup`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})})
      if(!res.ok){ throw new Error((await res.json()).detail || 'Signup failed') }
      await res.json()
      nav('/login')
    }catch(err){ setError(err.message) }
  }
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <h2 className="text-2xl font-bold mb-6">Create User Account</h2>
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <TextInput label="Full name" value={name} onChange={setName} placeholder="Jane Doe" />
            <TextInput label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
            <TextInput label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            <Button type="submit">Create account</Button>
          </form>
        </Card>
      </div>
    </Layout>
  )
}

function AdminLogin(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const nav = useNavigate()
  const submit = async (e)=>{
    e.preventDefault(); setError('')
    try{
      const res = await fetch(`${API}/auth/admin/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
      if(!res.ok){ throw new Error((await res.json()).detail || 'Login failed') }
      await res.json()
      // store minimal admin marker
      localStorage.setItem('fruito_admin','true')
      nav('/admin/dashboard')
    }catch(err){ setError(err.message) }
  }
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <TextInput label="Email" value={email} onChange={setEmail} type="email" placeholder="deeptesh2006@gmail.com" />
            <TextInput label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            <Button type="submit">Sign in</Button>
          </form>
        </Card>
      </div>
    </Layout>
  )
}

function Shop(){
  const {user, clear} = useAuth()
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  useEffect(()=>{(async()=>{
    const res = await fetch(`${API}/products`); const data = await res.json(); setItems(data); setLoading(false)
  })()},[])
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Shop</h2>
        <div className="text-sm text-gray-600">
          {user? (<div className="flex items-center gap-2">Hello, {user.name}! <button className="underline" onClick={clear}>Logout</button></div>): 'Browsing as guest'}
        </div>
      </div>
      {loading? <p>Loading...</p> : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(p=> (
            <Card key={p.id}>
              <div className="aspect-square rounded-xl bg-white/60 flex items-center justify-center text-5xl">🥝</div>
              <div className="mt-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
                <div className="mt-2 font-bold">${p.price.toFixed(2)}</div>
              </div>
              <div className="mt-4">
                <Button>Add to cart</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}

function AdminDashboard(){
  const isAdmin = localStorage.getItem('fruito_admin') === 'true'
  const nav = useNavigate()
  const [name,setName]=useState('')
  const [description,setDescription]=useState('')
  const [price,setPrice]=useState('')
  const [stock,setStock]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError] = useState('')
  const [success,setSuccess] = useState('')

  useEffect(()=>{ if(!isAdmin) nav('/admin') },[isAdmin])

  const createProduct = async (e)=>{
    e.preventDefault(); setError(''); setSuccess('')
    try{
      const body = {
        product: { name, description, price: parseFloat(price||'0'), stock: parseInt(stock||'0') },
        credentials: { email, password }
      }
      const res = await fetch(`${API}/admin/products`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
      if(!res.ok){ throw new Error((await res.json()).detail || 'Failed') }
      await res.json(); setSuccess('Product created')
      setName(''); setDescription(''); setPrice(''); setStock('')
    }catch(err){ setError(err.message) }
  }

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <h3 className="text-xl font-bold mb-4">Add product</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-3 text-emerald-700 text-sm">{success}</div>}
            <form onSubmit={createProduct} className="space-y-4">
              <TextInput label="Fruit name" value={name} onChange={setName} />
              <TextInput label="Description" value={description} onChange={setDescription} />
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Price" value={price} onChange={setPrice} type="number" />
                <TextInput label="Stock" value={stock} onChange={setStock} type="number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Admin email" value={email} onChange={setEmail} type="email" placeholder="deeptesh2006@gmail.com" />
                <TextInput label="Admin password" value={password} onChange={setPassword} type="password" />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </Card>
        </div>
        <div>
          <Card>
            <h3 className="text-xl font-bold mb-4">Inventory</h3>
            <InventoryList />
          </Card>
        </div>
      </div>
    </Layout>
  )
}

function InventoryList(){
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  useEffect(()=>{(async()=>{ const res = await fetch(`${API}/products`); const data = await res.json(); setItems(data); setLoading(false) })()},[])
  if(loading) return <p>Loading...</p>
  return (
    <div className="space-y-3">
      {items.map(p=> (
        <div key={p.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
          <div>
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-600">${p.price.toFixed(2)} • Stock: {p.stock}</div>
          </div>
          <div className="text-2xl">🥝</div>
        </div>
      ))}
    </div>
  )
}

function AdminGate(){
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <h2 className="text-2xl font-bold mb-6">Admin Area</h2>
          <p className="text-gray-600 mb-4">Restricted access. Use the dedicated admin credentials.</p>
          <Link to="/admin/login"><Button>Go to Admin Login</Button></Link>
        </Card>
      </div>
    </Layout>
  )
}

function Home(){
  return (
    <Layout>
      <Hero />
    </Layout>
  )
}

function Router(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminGate />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App(){
  return <Router />
}

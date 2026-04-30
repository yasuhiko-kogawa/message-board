import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://bdykadrcnjmhpypzcgsh.supabase.co','sb_publishable_DbvzARr7SDkPHr9RhgFvPA_nbUeKVRT')

export default function DigitalCircusContactBoard() {
  const [posts, setPosts] = useState([])
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [msg, setMsg] = useState('')

  const ngWords = ['援助', 'エロ', '副業詐欺', '投資勧誘']

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    const { data } = await supabase.from('circus_posts').select('*').order('id', { ascending: false })
    setPosts(data || [])
  }

  const containsNG = (text) => ngWords.some(w => text.includes(w))

  const submitPost = async () => {
    if (!name || !contact || !msg) return alert('全て入力してください')
    if (containsNG(name) || containsNG(contact) || containsNG(msg)) return alert('NGワードが含まれています')

    await supabase.from('circus_posts').insert([{ name, contact, msg }])
    setName(''); setContact(''); setMsg('')
    loadPosts()
  }

  const deletePost = async (id) => {
    await supabase.from('circus_posts').delete().eq('id', id)
    loadPosts()
  }

  return (
    <div className="min-h-screen bg-red-700 text-white px-3 md:px-6" style={{backgroundImage:'linear-gradient(to right, rgba(120,0,0,.5), rgba(180,0,0,.5))'}}>
      <header className="text-center py-8 md:py-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-2xl text-yellow-300">DIGITAL CIRCUS</h1>
        <p className="text-xl md:text-2xl mt-2 font-bold">連絡先交換 掲示板</p>
      </header>

      <section className="max-w-5xl mx-auto bg-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-yellow-200">新しく投稿する</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="ニックネーム" className="p-4 rounded-2xl text-black" />
          <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="連絡先（LINE・X・Instagram等）" className="p-4 rounded-2xl text-black" />
          <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="ひとことメッセージ" className="p-4 rounded-2xl text-black" />
        </div>
        <button onClick={submitPost} className="w-full bg-yellow-300 text-red-700 font-extrabold py-4 rounded-2xl text-xl shadow-xl">投稿する</button>
      </section>

      <section className="max-w-5xl mx-auto py-10 grid gap-5">
        {posts.map((post) => (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key={post.id} className="bg-blue-500/80 rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-white">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <h3 className="text-2xl md:text-3xl font-extrabold text-yellow-200">{post.name}</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-white text-red-600 px-4 py-2 rounded-full font-bold break-all">{post.contact}</span>
                <button onClick={()=>deletePost(post.id)} className="bg-red-600 p-2 rounded-full"><Trash2 size={18} /></button>
              </div>
            </div>
            <p className="mt-4 text-lg md:text-xl break-words">{post.msg}</p>
          </motion.div>
        ))}
      </section>

      <footer className="text-center py-8 text-white/80 font-semibold text-sm md:text-base">
        誰でも自由に投稿・連絡先交換OKのシンプル掲示板
      </footer>
    </div>
  )
}

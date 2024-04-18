import Main from '../components/main'
import Header from "../components/header"
import Footer from "../components/footer"

export default function Home() {
  return (
    <main className='m-2 min-w-[1200px] flex justify-center'>
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    </main>
  )
}

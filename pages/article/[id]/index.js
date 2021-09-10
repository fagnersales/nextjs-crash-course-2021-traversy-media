import Link from 'next/link'
import { useRouter } from 'next/router'

const Article = ({ article }) => {
  // const router = useRouter()
  // const { id } = router.query

  return (
    <>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <br />
      <Link href='/'>Go back</Link>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const id = context.params.id
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)

  const article = await res.json()

  return {
    props: {
      article
    }
  }
}

export default Article
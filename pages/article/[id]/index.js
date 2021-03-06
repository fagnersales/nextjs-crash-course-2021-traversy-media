import Meta from '../../../components/Meta'
import { server } from '../../../config'
import Link from 'next/link'
import { useRouter } from 'next/router'

const article = ({ article }) => {
  // const router = useRouter()
  // const { id } = router.query

  return (
    <>
      <Meta title={article.title} description={article.excerpt}/>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <br />
      <Link href='/'>Go back</Link>
    </>
  )
}

export const getStaticProps = async (context) => {
  const id = context.params.id
  const res = await fetch(`${server}/api/articles/${id}`)

  const article = await res.json()

  return {
    props: {
      article
    }
  }
}

export const getStaticPaths = async () => {
  const res = await fetch(`${server}/api/articles`)
  const articles = await res.json()

  const ids = articles.map(article => article.id)
  const paths = ids.map(id => ({
    params: { id: id.toString() }
  }))

  return {
    paths,
    fallback: false
  }
}


// export const getStaticProps = async (context) => {
//   const id = context.params.id
//   const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)

//   const article = await res.json()

//   return {
//     props: {
//       article
//     }
//   }
// }

// export const getStaticPaths = async () => {
//   const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=6`)
//   const articles = await res.json()

//   const ids = articles.map(article => article.id)
//   const paths = ids.map(id => ({
//     params: { id: id.toString() }
//   }))

//   return {
//     paths,
//     fallback: false
//   }
// }

export default article
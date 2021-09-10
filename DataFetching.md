### Data Fetching

- getStaticProps (Static Generation): Fetch data at **build time**.
If you export an `async` function called `getStaticProps` from a page, Next.js will pre-render this page at build time using the props returned by `getStaticProps`.
```js
export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```
The `context` parameter is an object containing the following keys:
  - `params` contains the route parameters for pages using dynamic routes. For example, if the page name is `[id].js`, then `params` will look like `{ id: ... }`. [Learn more](https://nextjs.org/docs/routing/dynamic-routes)
  - `preview` is `true` if the page is in the preview mode and `undefined` otherwise.
  - `previewData` contains the preview data set by `setPreviewData`. [Learn more](https://nextjs.org/docs/advanced-features/preview-mode)
  - `locale` contains the active locale (if enabled).
  - `locales` contains all supported locales (if enabled).
  - `defaultLocale` contains the configured default loacle (if enabled).
`getStaticProps` should return an object with:
  - `props` - An **optional** object with the props that will be received by the page component. It should be a **serializable object**
  - `revalidate` - An **optional** amount in seconds after which a page re-generation can occur. Defaults to `false`. When `revalidate` is `false` it means that there is no revalidation, so the page will be cached as built until your next build. [Learn more](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration)
  - `notFound` - An **optional** boolean value to allow the page to return a 404 status and page. Below is an example of how it works:
  ```js
  export async function getStaticProps(context) {
    const res = await fetch(`https://.../data`)
    const data = await res.json()

    if (!data) {
      return {
        notFound: true
      }
    }

    return {
      props: { data }, // will be passed to the page component as props
    }
  }
  ```
  > **Note:** `notFound` is not needed for `fallback: false` mode as only paths returned from `getStaticPaths` will be pre-rendered.
  > **Note:** With `notFound: ture` the page will return a 404 even if there was a successfully generated page before. This is meant to support use-cases like user generated content getting removed by its author.
  - `redirect` An **optional** redirect value to allow redirecting to internal and external resources. It should match the shape of `{ destination: string, permanent: boolean }`. In some rare cases, you might need to assign a custom status code for older HTTP Clients to properly redirect. In these cases, you can use the `statusCode` property instead of the `permanent` property, but not both. Below is an example of how it works:
  ```js
  export async function getStaticProps(context) {
    const res = await fetch(`https://...`)
    const data = await res.json()

    if (!data) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    return {
      props: { data }, // will be passed to the page component as props
    }
  }
  ```
  > **Note:** Redirecting at build-time is currently not allowed and if the redirects are known at build-time they should be added in [`next.config.js`](https://nextjs.org/docs/api-reference/next.config.js/redirects)

> **Note:** You can import modules in top-level scope for use in `getStaticProps`.
> Imports used in `getStaticProps` will (not be bundled for the client-side.)[https://nextjs.org/docs/basic-features/data-fetching#write-server-side-code-directly]
> This means you can write **server-side code directly in `getStaticProps`.** This inlucdes reading from teh filesystem or a database.

> **Note:** You should node use `fetch()` to call an API route in `getStaticProps`. Instead, directly import the logic used inside your API route. You may need to slightly refactor your code for this approach. (Fetching from an external API is fine!)

### Example

Here's an example which uses `getStaticProps` to fetch a list of blog posts from a CMS (content management system). This example is also in the (Pages documentation)[https://nextjs.org/docs/basic-features/pages]

```js
// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}
// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.jon()

  // By returning { props: { posts } }, the Blog compnoent
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts
    }
  }
}

export default Blog
```

### When should I use `getStaticProps`?

You should use `getStaticProps` if:
  - The data required to render the page is available at build time ahead of a user's request.
  - The data comes from a headless CMS.
  - The data can be publicly cched (not user-specific).
  - The page must be pre-rendered (for SEO) and be very fast — `getStaticProps` generates HTML and JSON files, both of which can be cached by a CDN for performance.

### TypeScript: Use `GetStaticProps`

For TypeScript, you can use the `GetStaticProps` tye from `next`:
```ts
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
}
```
If you want to get inferred typings for your props, you can use `InferGetStaticPropsType<typeof getStaticProps>`, like this:
```ts
import { InferGetStaticPropsType } from 'next'

type Post = {
  author: string
  content: string
}

export const getStaticProps = async () => {
  const res = await fetch('https://.../posts')
  const posts: Post[] = await res.json()

  return {
    props: {
      posts
    }
  }
}

function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  // will resolve posts to type Post[]
}

export default Blog
```

- getStaticPaths (Static Generation): Specify dynamic routes to pre-render pages based on data.

- getServerSideProps (Server-Side Rendering): Fetch data on **each request**.


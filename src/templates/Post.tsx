import React, { useEffect, useState } from 'react'
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import { PostTemplateQuery } from "../graphqlTypes"
import SEO from "../components/SEO"
import styled from '@emotion/styled'
import Tag from '../components/Tag'
import TOC from '../components/TOC'
import Utterances from '../components/Utterances'
import 'katex/dist/katex.min.css'

const Title = styled.h1`
  font-size: 3rem;
  margin: 3.75rem 0 0;
`

const Description = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  display: block;
`

const Time = styled.div`
  font-size: 1rem;
  color: var(--color-gray);
  margin: 0.5rem 0 1.25rem;
`

const TOCAnchor = styled.div`
  display: none;
  
  @media screen and (min-width : 1280px) {
    display: block;
    position: fixed;
    top: 10em;
    left: calc(50vw - 660px);
  }
`

const Section = styled.section`
  margin: 4.75rem 0;
  font-size: 16px;

  img {
    border-radius: 0.8em;
  }
`

const PostNav = styled.nav`
  margin: 1.5rem 0 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    color: var(--color-black);
  }
`

interface Props {
  data: PostTemplateQuery
}

const PostTemplate = ({ data }: Props) => {
  const post = data.markdownRemark!
  const { previous, next } = data
  const [ currentHeader, setCurrentHeader ] = useState('')

  if (!post) {
    return <div>ERROR!</div>
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const headerElems = document.querySelectorAll<HTMLAnchorElement>('a.anchor')
      if (headerElems.length === 0) {
        return
      }

      window.onscroll = () => {
        let memoizedHeader = ''
        const offset = 120

        // To highlight the header in TOC
        if (headerElems[headerElems.length-1].getBoundingClientRect().bottom < offset) {
          memoizedHeader = headerElems[headerElems.length-1].href
        } else {
          for (const elem of headerElems) {
            if (offset < elem.getBoundingClientRect().bottom) {
              break
            } else {
              memoizedHeader = elem.href
            }
          }
        }

        setCurrentHeader(memoizedHeader.split('/').pop() || '')
      }

      return () => { window.onscroll = null }
    }

    return () => {}
  }, [])

  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt || undefined}
      />
      <Layout>
        <TOCAnchor>
          <TOC html={data.markdownRemark!.tableOfContents!} currentHeader={currentHeader}/>
        </TOCAnchor>
        <article itemScope itemType="http://schema.org/Article">
          <header>
            <Title itemProp="headline">{post.frontmatter.title}</Title>
            { post.frontmatter.description &&
            <Description>{post.frontmatter.description}</Description> }
            <Time>{post.frontmatter.date} — {post.timeToRead} min read</Time>
            {post.frontmatter.tags.map(tag => (<Tag key={tag} tag={tag} />))}
          </header>
          <Section
            dangerouslySetInnerHTML={{ __html: post.html! }}
            itemProp="articleBody"
          />
        </article>
        <PostNav>
          {previous ? (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </Link>
          ) : (
            <div />
          )}
        </PostNav>
        <Utterances theme={'github-light'} />
      </Layout>
    </>
  )
}

export default PostTemplate

export const pageQuery = graphql`
  query postTemplate (
    $id: String!
    $prevPostId: String
    $nextPostId: String
  ) {
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      timeToRead
      tableOfContents
      frontmatter {
        title
        description
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
    previous: markdownRemark(id: { eq: $prevPostId }) {
      fields { slug }
      frontmatter { title }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields { slug }
      frontmatter { title }
    }
  }
`
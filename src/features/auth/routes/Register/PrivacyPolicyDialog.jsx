import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import privacyPolicyMarkdown from './privacy-policy.md?raw'

const inlineTokenPattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g

function renderInlineContent(text) {
  const nodes = []
  let lastIndex = 0

  for (const match of text.matchAll(inlineTokenPattern)) {
    const token = match[0]

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('[')) {
      const closingBracketIndex = token.indexOf('](')
      const label = token.slice(1, closingBracketIndex)
      const url = token.slice(closingBracketIndex + 2, -1)

      nodes.push(
        <a
          key={`${match.index}-link`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {label}
        </a>
      )
    } else {
      nodes.push(<em key={`${match.index}-em`}>{token.slice(1, -1)}</em>)
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function parseMarkdownBlocks(markdown) {
  const blocks = []
  const lines = markdown.trim().split(/\r?\n/)
  let paragraphLines = []
  let listItems = []

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return

    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
    paragraphLines = []
  }

  const flushList = () => {
    if (listItems.length === 0) return

    blocks.push({ type: 'list', items: listItems })
    listItems = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    if (trimmed === '---') {
      flushParagraph()
      flushList()
      blocks.push({ type: 'divider' })
      continue
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'title', text: trimmed.slice(2).trim() })
      continue
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'section', text: trimmed.slice(3).trim() })
      continue
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph()
      listItems.push(trimmed.slice(2).trim())
      continue
    }

    if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'emphasis', text: trimmed.slice(1, -1).trim() })
      continue
    }

    if (listItems.length > 0) {
      listItems[listItems.length - 1] = `${listItems[listItems.length - 1]} ${trimmed}`
      continue
    }

    paragraphLines.push(trimmed)
  }

  flushParagraph()
  flushList()

  return blocks
}

const privacyPolicyBlocks = parseMarkdownBlocks(privacyPolicyMarkdown)

function PrivacyPolicyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0"
        >
          Privacy Policy
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/70 p-6 pr-14">
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            This policy is shown in Spanish because it was prepared in accordance with Spanish data protection law.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {privacyPolicyBlocks.map((block, index) => {
            if (block.type === 'title') {
              return (
                <h1 key={index} className="font-heading text-xl font-semibold leading-tight text-foreground">
                  {renderInlineContent(block.text)}
                </h1>
              )
            }

            if (block.type === 'section') {
              return (
                <h2 key={index} className="font-heading text-base font-semibold leading-tight text-foreground">
                  {renderInlineContent(block.text)}
                </h2>
              )
            }

            if (block.type === 'paragraph') {
              return (
                <p key={index} className="text-sm leading-7 text-muted-foreground">
                  {renderInlineContent(block.text)}
                </p>
              )
            }

            if (block.type === 'list') {
              return (
                <ul key={index} className="space-y-2 pl-5">
                  {block.items.map((item, itemIndex) => (
                    <li key={`${index}-${itemIndex}`} className="list-disc text-sm leading-7 text-muted-foreground">
                      {renderInlineContent(item)}
                    </li>
                  ))}
                </ul>
              )
            }

            if (block.type === 'divider') {
              return <hr key={index} className="border-border" />
            }

            if (block.type === 'emphasis') {
              return (
                <p key={index} className="text-sm leading-7 text-muted-foreground">
                  <em>{renderInlineContent(block.text)}</em>
                </p>
              )
            }

            return null
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PrivacyPolicyDialog

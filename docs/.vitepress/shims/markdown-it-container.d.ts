declare module "markdown-it-container" {
  import type MarkdownIt from "markdown-it"
  const container: (md: MarkdownIt, name: string, options?: any) => void
  export default container
}
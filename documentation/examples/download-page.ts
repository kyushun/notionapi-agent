import * as fs from "fs"
import * as path from "path"
import { createAgent } from "../../"
import { Block } from "../../dist/interfaces/notion/models/block/"
import { Table } from "../../dist/interfaces/notion/models/common"

main()

async function main() {
  /**
   * https://www.notion.so/Writing-editing-guide-68c7c67047494fdb87d50185429df93e
   */
  const pageId = "68c7c670-4749-4fdb-87d5-0185429df93e"

  /** Create an API agent. */
  const notion = createAgent({ debug: true })

  let ctx = {
    start: true,
    childrenIds: [pageId],
    agent: notion
  }
  let page = {
    block: {}
  }
  while (ctx.childrenIds.length > 0) {
    console.log(`Start downloading next ${ctx.childrenIds.length} blocks.`)
    const life = await getChildrenBlocks(ctx)
    ctx = life.nextCtx
    life.result.forEach(r => page.block[r.id] = r)
  }

  fs.writeFileSync(
    path.join(__dirname, `Page-${pageId}.json`),
    JSON.stringify(page),
    { encoding: "utf-8" }
  )
}

type Context = {
  start: boolean
  childrenIds: string[]
  agent: ReturnType<typeof createAgent>
}

type Life = {
  result: Block[]
  nextCtx: Context
}

async function getChildrenBlocks(ctx: Context): Promise<Life> {

  const req = ctx.childrenIds.map(id => {
    return { id, table: Table.Block }
  })

  const res = await ctx.agent.getRecordValues({
    requests: req
  })

  const result = res.results
    .filter(r => r.role !== "none")
    .map(r => r.value) as Block[]

  const nextCtx = {
    start: false,
    childrenIds: result
      .reduce((childrenIds: string[], block) => {
        if ((ctx.start || block.type !== "page") && block.content) {
          return childrenIds.concat(block.content)
        } else {
          return childrenIds
        }
      }, []),
    agent: ctx.agent
  }

  return { nextCtx, result }
}
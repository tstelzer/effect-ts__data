import * as _ from "@effect/data"
import * as assert from "assert"
import glob from "glob"
import * as path from "path"

const getExportName = (name: string): string => {
  if (name === "HKT") {
    return name.toLowerCase()
  }
  if (name === "Const") {
    return "const_"
  }
  return name.substring(0, 1).toLowerCase() + name.substring(1)
}

function getModuleNames(): ReadonlyArray<string> {
  return glob
    .sync("./src/**/*.ts")
    .map((file) => path.parse(file))
    .filter((file) => !file.dir.startsWith("./src/internal"))
    .map((file) => file.name)
}

describe.concurrent("index", () => {
  it("check exported modules", () => {
    const moduleNames = getModuleNames()
    moduleNames.forEach((name) => {
      if (name !== "index") {
        const exportName = getExportName(name)
        assert.deepStrictEqual(
          // tslint:disable-next-line: strict-type-predicates
          (_ as Record<string, unknown>)[exportName] !== undefined,
          true,
          `The "${name}" module is not exported in src/index.ts as ${exportName}`
        )
      }
    })
  })
})

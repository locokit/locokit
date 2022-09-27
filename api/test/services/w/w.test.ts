import assert from "assert"
import { app } from "../../../src/app"

describe("w service", () => {
  it("registered the service", () => {
    const service = app.service("w")

    assert.ok(service, "Registered the service")
  })
})

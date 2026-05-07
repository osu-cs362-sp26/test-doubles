/**
 * @jest-environment jest-fixed-jsdom
 */

require("@testing-library/jest-dom")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

const http = require("msw").http
const HttpResponse = require("msw").HttpResponse
const setupServer = require("msw/node").setupServer

const searchRepositoriesResults = require("./searchRpositoriesResults.json")

const initDomFromFiles = require("../utils/initDomFromFiles")

const server = setupServer(
    http.get(
        "https://api.github.com/search/repositories",
        function () {
            console.log("== using the fake server")
            return HttpResponse.json(searchRepositoriesResults)
        }
    )
)

beforeAll(function () {
    server.listen()
})

afterAll(function () {
    server.close()
})

test("correctly displays GitHub search results", async function () {
    initDomFromFiles(
        __dirname + "/githubSearch.html",
        __dirname + "/githubSearch.js"
    )

    const queryInput = domTesting.getByPlaceholderText(document, "Search GitHub")
    const searchButton = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(queryInput, "jest")
    await user.click(searchButton)

    const resultItems = await domTesting.findAllByRole(document, "listitem")
    expect(resultItems).not.toHaveLength(0)
})

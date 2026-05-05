const registerUser = require("./registerUser")
const Database = require("./database")

test("saves user record in the database", function () {
    const email = "iamfake@oregonstate.edu"
    const password = "pa$$Word123"
    const spy = jest.spyOn(Database, "save")
    spy.mockImplementation(function () {})

    registerUser(email, password)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockRestore()
})

test("password is hashed before storing in database", function () {
    const email = "iamfake@oregonstate.edu"
    const password = "pa$$Word123"
    const spy = jest.spyOn(Database, "save")
    spy.mockImplementation(function () {})

    registerUser(email, password)

    const userRecord = spy.mock.lastCall[0]

    expect(userRecord).toMatchObject({
        password: expect.not.stringContaining(password)
    })

    spy.mockRestore()
})

test("returns null on database error", function () {
    const email = "iamfake@oregonstate.edu"
    const password = "pa$$Word123"
    const spy = jest.spyOn(Database, "save")
    spy.mockImplementation(function () { throw new Error() })

    const response = registerUser(email, password)

    expect(response).toBeNull()

    spy.mockRestore()
})

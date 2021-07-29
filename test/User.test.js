const { assert, should } = require("chai")

const User = artifacts.require("User")

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('User', accounts => {
    let user

    before(async () => {
        user = await User.new()
    })

    describe('Testing User methods behavior', async () => {

        it('should create user', async () => {
            result = await user.createUser("UserName", "name@email.com", {from: accounts[0]})

            const getUser = await user.getUser(accounts[0])
            assert.equal(getUser.name, "UserName", "Name should be UserName")
            assert.equal(getUser.email, "name@email.com", "email should be name@email.com")
    
            const event = result.logs[0].args
            assert.equal(event.user.name, "UserName")
            assert.equal(event.user.email, "name@email.com")
            assert.equal(event.user.isUser, true)
        })

        describe('if user exists', async () => {

            it("should change name", async () => {
                await user.changeName("Another name", {from: accounts[0]})
    
                const getUser = await user.getUser(accounts[0])
                assert.equal(getUser.name, "Another name", "Name should be 'Another name'")
            })
    
            it("should not change name if not provided", async () => {
                await user.changeName("", {from: accounts[0]}).should.be.rejected
            })
    
            it("should change email", async () => {
                await user.changeEmail("email@email.com", {from: accounts[0]})
                
                const getUser = await user.getUser(accounts[0])
                assert.equal(getUser.email, "email@email.com", "email should be 'email@email.com'")
            })
    
            it("should not change email if not provided", async () => {
                await user.changeEmail("", {from: accounts[0]}).should.be.rejected
            })
    
            it('should not create if alredy exists', async () => {
                await user.createUser("UserName", "name@email.com", {from: accounts[0]}).should.be.rejected   
            })

            it('should not change for the same name', async () => {
                await user.changeName("Another name", {from: accounts[0]}).should.be.rejected
            })

            it('should not change for the same email', async () => {
                await user.changeEmail("email@email.com", {from: accounts[0]}).should.be.rejected
            })
    
        })

        describe("if user doesn't exist", async () => {

            it('should not create if user name or email is empty', async () => {
                await user.createUser("", "name@email.com", {from: accounts[0]}).should.be.rejected   
                await user.createUser("UserName", "", {from: accounts[0]}).should.be.rejected   
            })

            it("can't change name if user doesn't exist", async () => {
                await user.changeName("Another name", {from: accounts[1]}).should.be.rejected
            })
    
            it("can't change email  if user doesn't exist", async () => {
                await user.changeEmail("email@email.com", {from: accounts[1]}).should.be.rejected
            })
            
        })



    })

})
import createLens, { composeLens } from '../lens'

interface User {
    name: string
    birthDate: Date
}

interface LoginContext {
    user: User
}
interface Model {
    loginContext: LoginContext
}

const loginContextLens = createLens<Model, LoginContext>(
    (model) => model.loginContext,
    (model, loginContext) => ({ ...model, loginContext })
)

const userLens = createLens<LoginContext, User>(
    (loginContext) => loginContext.user,
    (loginContext, user) => ({ ...loginContext, user })
)

const nameLens = createLens<User, string>(
    (user) => user.name,
    (user, name) => ({ ...user, name })
)

const modelToUserLens = composeLens(loginContextLens, userLens)

const modelToNameLens = composeLens(modelToUserLens, nameLens)

let model: Model

beforeEach(() => {
    model = {
        loginContext: {
            user: { name: 'Simon', birthDate: new Date('1993-12-19') },
        },
    }
})

test('should return Peter', () => {
    const updatedModel = modelToNameLens.set(model, 'Peter')
    expect(updatedModel.loginContext.user.name).toEqual('Peter')
})

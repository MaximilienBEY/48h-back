import userSeed from "./user.seed"

const Seed = async () => {
    await userSeed()
}


export default Seed
export {
    userSeed
}
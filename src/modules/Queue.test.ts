import { QueueManager } from "./Queue"

type FakeObj = {
    music: string
    info: {
        title: string
        author: string
    }
}

describe("tests Duvuaqueue and queue manager", () => {
    it("should test if the class is ok", async () => {
        const fakeId = "10923701237018273"
        
        const queueManager = new QueueManager<FakeObj>()

        expect(queueManager).toBeInstanceOf(QueueManager<FakeObj>)
        
        const queue = queueManager.createQueue(fakeId)
    
        const info1: FakeObj = { info: { title: "music1", author: "any" }, music: "music1" }
        const info2: FakeObj = { info: { title: "music2", author: "any" }, music: "music2" }

        queue.enqueue(info1)
        queue.enqueue(info2)

        expect(queue.getAll()[0]).toBe(info1)
        expect(queue.getAll()[1]).toBe(info2)

        const queueDequed = queue.dequeue()

        expect(queue.getAll()[0]).toBe(info2)

        expect(queueDequed).toBe(info1)
    })
})

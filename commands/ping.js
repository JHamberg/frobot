const ping = {
    aliases: ["ping", "latency", "delay"],
    description: "Provides bot and API latencies",
    run: async (msg, args, client) => {
        const output = await msg.channel.send("Waiting for response to ping..");
        const latency = output.createdTimestamp - msg.createdTimestamp;
        output.edit(`Bot latency is ${latency}ms, API latency is ${client.ping}ms`);
    }
}
module.exports = ping;
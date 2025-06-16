// RabbitMQ 连接配置
const amqp = require('amqplib');

const queue = 'test_queue';
const msg = '你好，RabbitMQ！';

async function produce() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(msg));
  console.log('消息已发送:', msg);
  await channel.close();
  await conn.close();
}

async function consume() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue(queue);
  console.log('等待接收消息...');
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('收到消息:', msg.content.toString());
      channel.ack(msg);
    }
  });
}

// 通过命令行参数决定运行生产者还是消费者
if (process.argv[2] === 'produce') {
  produce();
} else if (process.argv[2] === 'consume') {
  consume();
} else {
  console.log('用法: node index.js [produce|consume]');
} 
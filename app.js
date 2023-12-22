const mqtt = require('mqtt');
const mysql = require('mysql2')

const mqttBroker = 'mqtt://localhost:1883'
const mqttTopic = '/iot/teste'

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'root',
  database: 'iot',
});

const mqttClient = mqtt.connect(mqttBroker);

connection.connect((err) => {
  if (err) {
    console.error('Erro ao se conectar no MySQL:', err);
    return;
  }
  console.log('Conexão com o MySQL estabelecida');
});

mqttClient.on('connect', () => {
  console.log('Conectado ao broker MQTT');

  mqttClient.subscribe(mqttTopic, (err) => {
    if (err) {
      console.error('Erro ao se inscrever ao tópico MQTT:', err);
    }
    console.log('Inscrição ao tópico MQTT bem-sucedida');
  });
});

mqttClient.on('message', (topic, message) => {
  const payload = JSON.parse(message.toString());
  const data = Number(payload[0]);
  const data2 = payload[1].toString();
  const topicData = topic.toString();
  console.log(data, topic)

  const insertQuery = 'INSERT INTO mensagens_mqtt (topico, payload, payloadColor) VALUES (?, ?, ?)';
  
  connection.query(insertQuery, [topicData, data, data2], (error, results, fields) => {
    if (error) {
      console.error('Erro ao inserir dados no banco de dados:', error);
      return;
    }
    console.log('Dados inseridos com sucesso no banco de dados:', results);
  });
});
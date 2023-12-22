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
  const data = message.toString();
  const topicData = topic.toString();
  console.log(data, topic)

  const insertQuery = 'INSERT INTO mensagens_mqtt (topico, payload) VALUES (?, ?)';
  
  connection.query(insertQuery, [data, topicData], (error, results, fields) => {
    if (error) {
      console.error('Erro ao inserir dados no banco de dados:', error);
      return;
    }
    console.log('Dados inseridos com sucesso no banco de dados:', results);
  });
});
  
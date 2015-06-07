angular.module('starter.constants', [])


.constant("POT_STATES", [
  {text : "Остановлен", color: "stable"},
  {text: "Запущен", color:"balanced"},
  {text: "Нет пламени" , color: "assertive"},
  {text: "Перегрев 1" , color: "assertive"},
  {text: "Нет тяги" , color: "assertive"},
  {text: "Перегрев 2" , color: "assertive"},
  {text: "Низкое напр." , color: "calm"},
  {text: "Нет нагрева" , color: "calm"},
  {text: "Ошибка шлейфа" , color: "assertive"},
  {text : "Ожидание ответа", color: "calm"},

])

/**
 * Скрипт для отправки сообщений в Telegram канал
 */

/**
 * Отправляет сообщение в Telegram канал
 * @param {string} botToken - Токен Telegram бота
 * @param {string|number} chatId - ID канала (например, @channel_username или -1001234567890)
 * @param {string} message - Текст сообщения для отправки
 * @returns {Promise<boolean>} - true если сообщение отправлено успешно
 */
async function sendTelegramMessage(botToken, chatId, message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const body = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML' // Поддержка HTML форматирования
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.description || `HTTP error! status: ${response.status}`);
        }
        
        if (data.ok) {
            const now = new Date().toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            console.log(`✅ Сообщение успешно отправлено в ${chatId}`);
            console.log(`Время отправки: ${now}`);
            return true;
        } else {
            console.error(`❌ Ошибка отправки: ${data.description || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Ошибка при отправке сообщения: ${error.message}`);
        return false;
    }
}

/**
 * Основная функция
 */
async function main() {
    // Получаем переменные окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = process.env.MESSAGE_TEXT || 'Привет! Это автоматическое сообщение из GitHub Actions.';
    
    // Проверяем наличие обязательных переменных
    if (!botToken) {
        console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не установлен');
        process.exit(1);
    }
    
    if (!chatId) {
        console.error('❌ Ошибка: TELEGRAM_CHAT_ID не установлен');
        process.exit(1);
    }
    
    // Отправляем сообщение
    const success = await sendTelegramMessage(botToken, chatId, message);
    
    if (!success) {
        process.exit(1);
    }
}

// Запускаем скрипт
main().catch(error => {
    console.error('❌ Неожиданная ошибка:', error);
    process.exit(1);
});


const { executeAction } = require('../actionExecutor');
const axios = require('axios');

jest.mock('axios'); // mock HTTP requests

describe('executeAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log the message for log action', async () => {
    console.log = jest.fn();
    const rule = { name: 'TestLog', actionType: 'log', actionConfig: { message: 'Hello' } };
    await executeAction(rule);
    expect(console.log).toHaveBeenCalledWith('[Rule:TestLog] LOG ACTION =>', 'Hello');
  });

  it('should call the Telegram API', async () => {
    const rule = {
      name: 'TelegramRule',
      actionType: 'telegram',
      actionConfig: { botToken: '123', chatId: '456', message: 'Hi' }
    };
    axios.post.mockResolvedValue({ data: { ok: true } });
    await executeAction(rule);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.telegram.org/bot123/sendMessage',
      { chat_id: '456', text: 'Hi' }
    );
  });

  it('should warn for unknown actionType', async () => {
    console.warn = jest.fn();
    const rule = { name: 'Unknown', actionType: 'unknown' };
    await executeAction(rule);
    expect(console.warn).toHaveBeenCalledWith('[Rule:Unknown] Unknown action type: unknown');
  });
});

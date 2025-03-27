document.addEventListener('DOMContentLoaded', () => {
    marked.setOptions({
        highlight: (code, lang) => {
            const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language: validLang }).value;
        },
        gfm: true,
        breaks: true
    });

    const elements = {
        sendBtn: document.getElementById('send-button'),
        clearBtn: document.getElementById('clear-button'),
        userInput: document.getElementById('user-message'),
        conversation: document.getElementById('conversation-container'),
        status: document.getElementById('status')
    };

    const renderMarkdown = () => {
        document.querySelectorAll('.assistant-message .message-content').forEach(el => {
            if (!el.dataset.rendered) {
                el.innerHTML = marked.parse(el.textContent);
                el.querySelectorAll('pre code').forEach(block => {
                    hljs.highlightElement(block);
                });
                el.dataset.rendered = 'true';
            }
        });
    };

    const updateConversation = (messages) => {
        elements.conversation.innerHTML = '';
        if (messages.length === 0) {
            elements.conversation.innerHTML = '<div class="empty">暂无对话</div>';
            return;
        }
        
        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.role}-message`;
            
            const header = document.createElement('div');
            header.className = 'message-header';
            header.innerHTML = `
                <span class="role">${msg.role === 'user' ? 'B7班大触' : 'DeepseekV3'}</span>
                <span class="time">${msg.time}</span>
            `;
            
            const content = document.createElement('div');
            content.className = msg.role === 'user' ? 'message-content' : 'markdown-body message-content';
            content.textContent = msg.content;
            
            msgDiv.appendChild(header);
            msgDiv.appendChild(content);
            elements.conversation.appendChild(msgDiv);
        });
        
        renderMarkdown();
        elements.conversation.scrollTop = elements.conversation.scrollHeight;
    };

    const sendMessage = async () => {
        const message = elements.userInput.value.trim();
        if (!message) return;

        elements.sendBtn.disabled = true;
        showStatus('发送中...', 'loading');

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (!response.ok) throw new Error(await response.text());
            
            const data = await response.json();
            updateConversation(data.conversation);
            showStatus('发送成功', 'success');
            elements.userInput.value = '';
        } catch (error) {
            showStatus(`发送失败: ${error.message}`, 'error');
        } finally {
            elements.sendBtn.disabled = false;
        }
    };

    const clearConversation = async () => {
        try {
            await fetch('/api/clear', { method: 'POST' });
            updateConversation([]);
            showStatus('会话已清除', 'success');
        } catch (error) {
            showStatus(`清除失败: ${error.message}`, 'error');
        }
    };

    elements.sendBtn.addEventListener('click', sendMessage);
    elements.clearBtn.addEventListener('click', clearConversation);
    /**
    elements.userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    */

    const showStatus = (text, type) => {
        elements.status.textContent = text;
        elements.status.className = `status ${type}`;
        if (type !== 'loading') {
            setTimeout(() => {
                elements.status.className = 'status';
            }, 3000);
        }
    };

    updateConversation([]);
});
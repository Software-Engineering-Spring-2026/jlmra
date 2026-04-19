import React from 'react';
import { type Conversation, type Role, roleMeta } from '../mockData';
import { Badge, PageHeader, Panel } from '../components/ui';

type InboxPageProps = {
  role: Role;
  conversations: Conversation[];
  selectedConversation: Conversation;
  selectedConversationId: string;
  setSelectedConversationId: (id: string) => void;
  messageDraft: string;
  setMessageDraft: (value: string) => void;
  onSendMessage: () => void;
};

export function InboxPage({
  role,
  conversations,
  selectedConversation,
  selectedConversationId,
  setSelectedConversationId,
  messageDraft,
  setMessageDraft,
  onSendMessage,
}: InboxPageProps) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={roleMeta[role].label}
        title="Private messages"
        description="Each role gets a simpler messaging page so the conversation list and thread are easy to scan."
      />
      <div className="content-grid content-grid-wide">
        <Panel title="Conversation list" subtitle="Focused, readable threads">
          <div className="stack-list">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`list-button ${
                  conversation.id === selectedConversationId ? 'active' : ''
                }`}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <div>
                  <strong>{conversation.name}</strong>
                  <span>
                    {conversation.role} · {conversation.subtitle}
                  </span>
                </div>
                {conversation.unread > 0 ? (
                  <Badge tone="accent">{conversation.unread} unread</Badge>
                ) : null}
              </button>
            ))}
          </div>
        </Panel>
        <Panel title={selectedConversation.name} subtitle={selectedConversation.subtitle}>
          <div className="message-list">
            {selectedConversation.messages.map((message) => (
              <article
                key={message.id}
                className={`message-bubble ${
                  message.author === 'me' ? 'message-bubble-me' : 'message-bubble-them'
                }`}
              >
                <p>{message.body}</p>
                <span>{message.time}</span>
              </article>
            ))}
          </div>
          <div className="composer">
            <textarea
              rows={3}
              value={messageDraft}
              onChange={(event) => setMessageDraft(event.target.value)}
              placeholder="Write a private message"
            />
            <button type="button" className="primary-button" onClick={onSendMessage}>
              Send
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

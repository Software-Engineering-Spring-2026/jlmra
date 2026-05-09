import React from 'react';
import { type Conversation, type Role, roleMeta } from '../mockData';
import { Badge, PageHeader, Panel } from '../components/ui';

type InboxPageProps = {
  role: Role;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messageDraft: string;
  setMessageDraft: (value: string) => void;
  onSendMessage: () => void;
  onOpenConversation: (id: string) => void;
  onBackToConversationList: () => void;
};

export function InboxPage({
  role,
  conversations,
  selectedConversation,
  messageDraft,
  setMessageDraft,
  onSendMessage,
  onOpenConversation,
  onBackToConversationList,
}: InboxPageProps) {
  if (!selectedConversation) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow={roleMeta[role].label}
          title="Private messages"
          description="Send and receive private messages."
        />
        <Panel title="Contacts" subtitle="Private message threads">
          <div className="stack-list">
            {conversations.map((conversation) => {
              const latestMessage =
                conversation.messages[conversation.messages.length - 1]?.body ??
                'No messages yet';

              return (
                <button
                  key={conversation.id}
                  type="button"
                  className="list-button conversation-link"
                  onClick={() => onOpenConversation(conversation.id)}
                >
                  <div className="conversation-meta">
                    <strong>{conversation.name}</strong>
                    <span>
                      {conversation.role} · {conversation.subtitle}
                    </span>
                    <p>{latestMessage}</p>
                  </div>
                  <div className="conversation-side">
                    {conversation.unread > 0 ? (
                      <Badge tone="warn">{conversation.unread}</Badge>
                    ) : (
                      <Badge tone="neutral">Open</Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={roleMeta[role].label}
        title={selectedConversation.name}
        description={`${selectedConversation.role} · ${selectedConversation.subtitle}`}
        action={
          <button
            type="button"
            className="ghost-button"
            onClick={onBackToConversationList}
          >
            Back to Contacts
          </button>
        }
      />
      <Panel title="Conversation" subtitle="Focused thread view">
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
            placeholder={`Write a private message to ${selectedConversation.name}`}
          />
          <button type="button" className="primary-button" onClick={onSendMessage}>
            Send
          </button>
        </div>
      </Panel>
    </div>
  );
}

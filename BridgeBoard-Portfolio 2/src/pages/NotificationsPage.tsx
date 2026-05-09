import React from 'react';
import { type NotificationItem, type Role, roleMeta } from '../mockData';
import { Badge, PageHeader, Panel } from '../components/ui';

type NotificationsPageProps = {
  role: Role;
  notifications: NotificationItem[];
  enabled: boolean;
  onToggleEnabled: () => void;
  onToggleRead: (notificationId: string) => void;
};

export function NotificationsPage({
  role,
  notifications,
  enabled,
  onToggleEnabled,
  onToggleRead,
}: NotificationsPageProps) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={roleMeta[role].label}
        title="Notifications"
        description="The notifications page is now separated from everything else so unread items are much easier to manage."
        action={
          <button type="button" className="ghost-button" onClick={onToggleEnabled}>
            Turn {enabled ? 'off' : 'on'}
          </button>
        }
      />
      {!enabled ? (
        <div className="notice-banner">
          Notifications are paused for this role. Existing history still stays visible.
        </div>
      ) : null}
      <Panel
        title={`${notifications.length} alerts`}
        subtitle="Unread items are highlighted and can be toggled individually."
      >
        <div className="stack-list">
          {notifications.map((notification) => (
            <article key={notification.id} className="list-card">
              <div className="list-card-head">
                <div>
                  <strong>{notification.title}</strong>
                  <span>{notification.time}</span>
                </div>
                <Badge
                  tone={
                    notification.read
                      ? 'neutral'
                      : notification.tone === 'warn'
                      ? 'warn'
                      : 'accent'
                  }
                >
                  {notification.read ? 'Read' : 'Unread'}
                </Badge>
              </div>
              <p>{notification.message}</p>
              <button
                type="button"
                className="ghost-button"
                onClick={() => onToggleRead(notification.id)}
              >
                Mark as {notification.read ? 'unread' : 'read'}
              </button>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

import React from 'react';
export function EventHeading({ title, subtitle }) { return <header className="screen-heading"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</header>; }
export function StatCard({ icon: Icon, value, label }) { return <article className="event-stat">{Icon && <Icon />}<strong>{value}</strong><span>{label}</span></article>; }
export function Tag({ children }) { return <span className="reference-tag">{children}</span>; }

import { useEffect, useId, useState, type InputHTMLAttributes } from 'react';
import eyeIcon from '../../../assets/brand/icons/nav-im-blick.svg';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> & { label: string };

export function PasswordField({ label, value, disabled, ...inputProps }: Props) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  // Never carry visibility into a cleared field or a new form instance.
  useEffect(() => { if (!value || disabled) setVisible(false); }, [value, disabled]);
  const action = `${label} ${visible ? 'verbergen' : 'anzeigen'}`;
  return <div className="password-field">
    <label htmlFor={id}>{label}</label>
    <div className="password-control">
      <input {...inputProps} id={id} type={visible ? 'text' : 'password'} value={value} disabled={disabled} />
      <button type="button" className="password-toggle" aria-label={action} title={action}
        aria-controls={id} aria-pressed={visible} disabled={disabled}
        onClick={() => setVisible(current => !current)}>
        <span className="password-eye" aria-hidden="true">
          <img src={eyeIcon} alt="" />
          {visible && <svg viewBox="0 0 128 128"><path d="M22 20 106 108" stroke="currentColor" strokeWidth="10" strokeLinecap="round" /></svg>}
        </span>
      </button>
    </div>
  </div>;
}

declare namespace Firebase {
  type Timestamp = import('@firebase/firestore').Timestamp;
}

declare namespace Mobi {
  type MbscCalendarEvent = import('@mobiscroll/react').MbscCalendarEvent;
  type MbscEventClickEvent = import('@mobiscroll/react').MbscEventClickEvent;
  type MbscEventCreateEvent = import('@mobiscroll/react').MbscEventCreateEvent;
}

declare namespace Yup {
  type InferType = import('yup').InferType;
}

interface AnyProps extends Record<string, any> {}
interface ChildrenProps {
  children?: React.ReactNode;
}
interface FunctionChildren<T> {
  children: (p: T) => React.ReactElement;
}
type ReactComponent = (p: AnyProps) => React.ReactElement;
type SetFunction<T> = React.Dispatch<React.SetStateAction<T>>;
type State<T> = [T, SetFunction<T>];
type EmptyFunction = () => void;

interface LabelType {
  name: string;
  color: string;
  description?: string;
}

interface DbEntity {
  id?: string;
  group: string;
}

interface MapEntity {
  place: string;
  center: google.maps.LatLngLiteral;
}

interface User extends DbEntity, Partial<MapEntity> {
  id?: string;
  email: string;
  name: string;
  status: Role; // TODO: questo deve cambiare in "role"
  note: string;
  group: string;
  color?: string;
}
interface PreviewableFile extends Pick<File, 'type'> {
  preview: string;
  file: File | Blob;
  extension: string;
  name?: string;
  time: Date;
}

interface Key extends Partial<MapEntity> {
  color: string;
  description: string;
  name: string;
  search: boolean;
  select: boolean;
}
interface Category extends DbEntity {
  id?: string;
  name: string;
  color: string;
  pin: boolean;
  multiple: boolean;
  required: boolean;
  keys: Key[];
}

type FileData = {
  extension: string;
  filename: string;
  url?: string | null;
  name: string;
  type: string;
  time: Date;
};

type KeyData = { category: string; name: string };

interface AppEvent extends DbEntity, MapEntity {
  id?: string;
  keys: KeyData[];
  chain_prev?: string;
  chain_next?: string;
  created_at: Date | Firebase.Timestamp;
  date?: Date | Firebase.Timestamp;
  end_date?: Date | Firebase.Timestamp;
  files: FileData[];
  name: string;
  note: string;
  status: string;
  owner?: string;
  user?: string;
  start_recording?: Date | Firebase.Timestamp;
  end_recording?: Date | Firebase.Timestamp;
}

interface Template extends DbEntity {
  name: string;
  json: any;
}

interface Endpoint extends DbEntity, Pick<AppEvent, 'center' | 'place' | 'user'> {
  placeFromKeys: boolean;
  name: string;
  template: string;
  keys: KeyData[];
}

interface Group {
  id: string;
  name?: string;
  files: Pick<FileData, 'name' | 'url'>[];
}

// Tipi per il calendario
type CalendarEvent = Mobi.MbscCalendarEvent & AppEvent;
type CalendarClickEvent = Mobi.MbscEventClickEvent & { event: CalendarEvent };
type CalendarCreateEvent = Mobi.MbscEventCreateEvent & { event: CalendarEvent };

type Autocomplete = {
  id: string;
  options: string[];
};

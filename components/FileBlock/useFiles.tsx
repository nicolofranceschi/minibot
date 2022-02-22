import { useMemo, useReducer } from "react";

type ChangeNameAction = { i: number; name: string };
type Type = keyof Actions;
type ActionFactory<T extends Type, Data> = {
    type: T;
    data: Data;
};

type EventForm = { files: PreviewableFile[] };

type Actions = {
    addFiles: ActionFactory<'addFiles', EventForm['files']>;
    removeFiles: ActionFactory<'removeFiles', number[]>;
    changeFileName: ActionFactory<'changeFileName', ChangeNameAction>;
};
type Action = Actions[keyof Actions];

export default function useFiles() {
    const [event, dispatch] = useReducer(reducer, { files: [] });
    return useMemo(() => {
        const { files } = event;
        return {
            event,
            filesProps: {
                files,
                addFiles: (data: Actions['addFiles']['data']) => dispatch({ type: 'addFiles', data }),
                removeFiles: (data: Actions['removeFiles']['data']) => dispatch({ type: 'removeFiles', data }),
                changeName: (data: Actions['changeFileName']['data']) => dispatch({ type: 'changeFileName', data }),
            }
        };
    }, [event]);
}

function reducer(state: EventForm, action: Action): EventForm {
    switch (action.type) {
        case 'addFiles':
            return { ...state, files: [...state.files, ...action.data] };
        case 'removeFiles':
            return { ...state, files: state.files.filter((_, i) => !action.data.some(r => r === i)) };
        case 'changeFileName':
            return { ...state, files: state.files.map((file, i) => (i === action.data.i ? { ...file, name: action.data.name } : file)) };
        default:
            return state;
    }
}

export type FilesProps = ReturnType<typeof useFiles>['filesProps'];

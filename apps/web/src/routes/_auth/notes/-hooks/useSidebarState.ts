interface SidebarState {
  collapsedFolders: Record<string, boolean>;
  editingFolders: Set<string>;
}

export type SidebarAction =
  | {
      type: "toggle_folder";
      payload: string;
    }
  | { type: "create_folder"; payload: string }
  | { type: "start_editing_folder"; payload: string }
  | { type: "stop_editing_folder"; payload: string };

export const initialSidebarState: SidebarState = {
  collapsedFolders: {},
  editingFolders: new Set(),
};

export const sidebarReducer = (state: SidebarState, action: SidebarAction) => {
  switch (action.type) {
    case "toggle_folder": {
      const collapsedFolders = {
        ...state.collapsedFolders,
        [action.payload]: !state[action.payload],
      };
      return {
        ...state,
        collapsedFolders,
      };
    }
    case "create_folder": {
      const editingFolders = new Set(state.editingFolders).add(action.payload);
      return {
        ...state,
        editingFolders,
      };
    }
    case "start_editing_folder": {
      const editingFolders = new Set(state.editingFolders).add(action.payload);
      return {
        ...state,
        editingFolders,
      };
    }
    case "stop_editing_folder": {
      const editingFolders = new Set(state.editingFolders);
      if (editingFolders.has(action.payload)) {
        editingFolders.delete(action.payload);
      }
      return {
        ...state,
        editingFolders,
      };
    }
  }
};

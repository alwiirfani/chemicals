import { AddUserDialog } from "@/components/dialog/users/add-user-dialog";
import { EditUserDialog } from "@/components/dialog/users/edit-user-dialog";
import { DetailUserDialog } from "@/components/dialog/users/detail-user-dialog";
import { UserAuth } from "@/types/auth";

interface UserDialogsProps {
  selectedUser: UserAuth | null;
  showAddDialog: boolean;
  showEditDialog: boolean;
  showDetailDialog: boolean;
  onUserAdded: () => void;
  onUserUpdated: () => void;
  onCloseAdd: () => void;
  onCloseEdit: () => void;
  onCloseDetail: () => void;
}

export const UserDialogs: React.FC<UserDialogsProps> = ({
  selectedUser,
  showAddDialog,
  showEditDialog,
  showDetailDialog,
  onUserAdded,
  onUserUpdated,
  onCloseAdd,
  onCloseEdit,
  onCloseDetail,
}) => {
  return (
    <>
      <AddUserDialog
        open={showAddDialog}
        onOpenChange={onCloseAdd}
        onUserAdded={onUserAdded}
      />
      {selectedUser && (
        <>
          {selectedUser.role !== "ADMIN" && (
            <EditUserDialog
              open={showEditDialog}
              onOpenChange={onCloseEdit}
              user={selectedUser}
              onUserUpdated={onUserUpdated}
            />
          )}
          <DetailUserDialog
            open={showDetailDialog}
            onOpenChange={onCloseDetail}
            user={selectedUser}
          />
        </>
      )}
    </>
  );
};

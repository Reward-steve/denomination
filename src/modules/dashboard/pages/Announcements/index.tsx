import { useCallback, useEffect, useMemo, useState } from "react";
import { FaUpload, FaFileAlt, FaTrash } from "react-icons/fa";
import DashboardLayout from "../../components/Layout";
import { Button } from "../../../../components/ui/Button";
import { CreateAnnc, DeleteAnnc, FetchAnnc, UpdateAnnc } from "./services";
import { toast } from "react-toastify";
import { AnncCard } from "./components/AnncCard";
import { Modal } from "../../components/Modal";
import FormInput from "../../../../components/ui/FormInput";
import TextArea from "../../../../components/ui/TextArea";
import { Loader } from "../../../../components/ui/Loader";
import { sendNotification } from "./services/broadcaster";
import { DashboardHeader } from "../../components/Header";

/* -------------------- Types -------------------- */
interface iAnnouncements {
  id: number;
  body: string;
  title: string;
  created_by?: string;
  created_at?: string;
}

const AnncCardSkeleton = () => (
  <div className="animate-pulse p-4 border border-border rounded-lg shadow-sm bg-muted">
    <div className="h-5 w-2/3 bg-surface rounded mb-2" />
    <div className="h-4 w-1/2 bg-surface rounded mb-1" />
    <div className="h-4 w-1/4 bg-surface rounded" />
  </div>
);

/* -------------------- Page -------------------- */
export default function Announcements() {
  const btnState = {
    create: {
      text: "Submit",
      busy: "Submitting...",
      action: (x: any) => postAnnc(x),
    },
    edit: {
      text: "Save",
      busy: "Saving...",
      action: (x: any) => saveEdit(x),
    },
  };
  const [annc, setAnnc] = useState<iAnnouncements[]>([]);
  const [buttonState, setButtonState] = useState(btnState.create);
  const [loading, setLoading] = useState(true);
  const [postingAnnc, setPostingAnnc] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState<iAnnouncements>({
    title: "",
    body: "",
    id: 0,
  });

  const [options, setOptions] = useState<any>({
    search: "",
    page: 1,
    per_page: 100,
  });

  // Handle file selection
  useEffect(() => {
    FetchAnnc(options)
      .then(({ data: { data } }) => {
        setAnnc(data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleModalClosing = () => {
    setFormData({ title: "", body: "", id: 0 });
    setOpenModal(false);
  };

  // Delete announcement

  const handleDelete = async (aid: number) => {
    if (confirm("Are you sure you want to delete this Announcement?")) {
      setAnnc((p) => p.filter(({ id }) => id !== aid));
      await DeleteAnnc(aid);
      toast.success("Announcement deleted");
    }
  };

  //handle announcement edit
  const handleEdit = (a: iAnnouncements) => {
    setFormData(a);
    setOpenModal(true);
    setButtonState(btnState.edit);
  };

  const saveEdit = useCallback(
    (f: any) => {
      setPostingAnnc(true);
      console.log(f);

      UpdateAnnc(f, f.id)
        .then(({ data: { data } }) => {
          //find id in annc and update it with data
          setAnnc((p) => p.map((item) => (item.id === data.id ? data : item)));
          setOpenModal(false);
          setFormData({ title: "", body: "", id: 0 });
          setButtonState(btnState.create);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setPostingAnnc(false);
        });
    },
    [formData.body, formData.title, formData.id]
  );

  const postAnnc = (a = null) => {
    CreateAnnc(formData)
      .then(({ data: { data } }) => {
        toast.success("Announcement Broadcasted!!!");
        setOpenModal(false);
        setAnnc([data, ...annc]);
        sendNotification({ title: data.title, body: data.body });
        setFormData({ title: "", body: "", id: 0 });
      })
      .catch((e) => {
        console.log(e);
        toast.error("Could not Broadcast your announcement. Try again later");
      })
      .finally(() => {
        setPostingAnnc(false);
      });
  };

  return (
    <DashboardLayout>
      {openModal && (
        <Modal title={"New Announcement"} onClose={handleModalClosing}>
          <div className="p-4 min-w-[200px] sm:min-w-[500px]">
            <FormInput
              value={formData.title}
              label="Title"
              placeholder="Announcement Title"
              type="text"
              className="mb-4"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextArea
              value={formData.body}
              label="Body"
              placeholder="What is the announcement?"
              className="mb-4"
              rows={7}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="gray" onClick={handleModalClosing}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => buttonState.action(formData)}
              >
                {postingAnnc ? (
                  <>
                    <Loader />
                    <span>{buttonState.busy}</span>
                  </>
                ) : (
                  <span>{buttonState.text}</span>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <DashboardHeader
        title="Announcements"
        description="Broadcast information to your member"
        actionLabel="Make Announcement"
        onAction={() => setOpenModal(true)}
      >
        <div className="grid gap-4">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <AnncCardSkeleton key={i} />
            ))}

          {!loading &&
            annc.map((a, idx) => (
              <AnncCard
                data={a}
                key={idx}
                onEdit={() => handleEdit(a)}
                onDelete={() => handleDelete(a.id)}
              />
            ))}
        </div>
      </DashboardHeader>
    </DashboardLayout>
  );
}

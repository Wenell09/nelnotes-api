const { v4: uuidv4 } = require('uuid');
const { supabase } = require('./supabase');

function welcome(req, res) {
    return res.json({
        status: "success",
        message: "Welcome to Nelnotes",
        informasi: {
            lihat_note: "/note/{user_id}",
            detail_note: "/note/{user_id}/{note_id}",
            buat_note: "/addNote",
            ubah_note: "/editNote/{user_id}/{note_id}",
            hapus_note: "/deleteNote/{user_id}/{note_id?}",
            cari_note: "/searchNote?user_id={query}&title={query}",
            buat_pin: "/addPin/{user_id}/{note_id}",
            hapus_pin: "/deletePin/{user_id}/{note_id}",
            lihat_akun: "/account/{user_id}",
            buat_akun: "/addAccount"
        }
    });
}

async function addNote(req, res) {
    const { user_id, title, deskripsi } = req.body;
    const note_id = uuidv4();
    if (!note_id) {
        return res.status(404).json({
            status: "failed",
            message: "note id kosong, wajib diisi!"
        });
    }
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong, wajib diisi!"
        });
    }
    if (!title) {
        return res.status(404).json({
            status: "failed",
            message: "title wajib diisi!"
        });
    }
    if (!deskripsi) {
        return res.status(404).json({
            status: "failed",
            message: "deskripsi wajib diisi!"
        });
    }
    const { data, error } = await supabase
        .from("note")
        .insert([{
            note_id, user_id, title, deskripsi, created_at: new Date().toISOString(),
        }]);
    if (error) {
        return res.status(404).json({
            status: "failed",
            message: error.message,
        });
    }
    return res.json({
        status: "success",
        message: "note berhasil dibuat",
    });
}

async function getNote(req, res) {
    const { user_id } = req.params;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong, wajib diisi!"
        });
    }
    const { data, error } = await supabase
        .from("note")
        .select("*")
        .eq("user_id", user_id);
    if (error) {
        return res.status(404).json({
            status: "failed",
            message: error.message,
        });
    }
    return res.json({
        status: "success",
        data: data,
    });
}

async function getDetailNote(req, res) {
    const { user_id, note_id } = req.params;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong, wajib diisi!"
        });
    }
    if (!note_id) {
        return res.status(404).json({
            status: "failed",
            message: "note id kosong, wajib diisi!"
        });
    }
    const { data, error } = await supabase
        .from("note")
        .select("*")
        .eq("user_id", user_id)
        .eq("note_id", note_id);
    if (error) {
        return res.status(404).json({
            status: "failed",
            message: error.message,
        });
    }
    return res.json({
        status: "success",
        data: data,
    });
}

async function editNote(req, res) {
    const { user_id, note_id } = req.params;
    const { title, deskripsi } = req.body;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong,wajib diisi!"
        });
    }
    if (!note_id) {
        return res.status(404).json({
            status: "failed",
            message: "note id kosong,wajib diisi!"
        });
    }
    const { data, error } = await supabase
        .from("note")
        .select("*")
        .eq("user_id", user_id)
        .eq("note_id", note_id);
    if (data.length === 0) {
        return res.status(404).json({
            status: "failed",
            message: "note id tidak sama, tidak berhasil mengupdate!"
        });
    }
    else {
        const { data, error } = await supabase
            .from("note")
            .update({ title, deskripsi, created_at: new Date().toISOString() })
            .eq("user_id", user_id)
            .eq("note_id", note_id);
        if (error) {
            return res.status(404).json({
                status: "failed",
                message: error.message,
            });
        }
        return res.json({
            status: "success",
            message: "note berhasil diubah",
        });
    }
}


async function deleteNote(req, res) {
    const { user_id, note_id } = req.params;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong,wajib diisi!"
        });
    }
    if (!note_id) {
        const { data, error } = await supabase
            .from("note")
            .delete()
            .eq("user_id", user_id);
        if (error) {
            return res.status(404).json({
                status: "failed",
                message: error.message,
            });
        }
        return res.json({
            status: "success",
            message: "semua note berhasil dihapus",
        });
    }
    else {
        const { data, error } = await supabase
            .from("note")
            .delete()
            .eq("user_id", user_id)
            .eq("note_id", note_id);
        if (error) {
            return res.status(404).json({
                status: "failed",
                message: error.message,
            });
        }
        return res.json({
            status: "success",
            message: "note berhasil dihapus",
        });
    }
}

async function searchNote(req, res) {
    const { user_id, title } = req.query;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong,wajib diisi!"
        });
    }
    if (!title) {
        const { data, error } = await supabase
            .from("note")
            .select("*")
            .eq("user_id", user_id);
        if (error) {
            return res.status(404).json({
                status: "failed",
                message: error.message,
            });
        }
        return res.json({
            status: "success",
            data: data,
        });
    }
    else {
        const { data, error } = await supabase
            .from("note")
            .select("*")
            .eq("user_id", user_id)
            .ilike("title", `${title}%`);
        if (error) {
            return res.status(404).json({
                status: "failed",
                message: error.message,
            });
        }
        return res.json({
            status: "success",
            data: data,
        });
    }
}

async function addPin(req, res) {
    const { user_id, note_id } = req.params;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong,wajib diisi!"
        });
    }
    if (!note_id) {
        return res.status(404).json({
            status: "failed",
            message: "note id kosong,wajib diisi!"
        });
    }
    const { data, error } = await supabase
        .from("note")
        .select("*")
        .eq("user_id", user_id)
        .eq("note_id", note_id);
    if (data.length === 0) {
        return res.status(404).json({
            status: "failed",
            message: "note id tidak sama, tidak berhasil menambah pin!"
        });
    } else {
        const { data, error } = await supabase
            .from("note")
            .update({ is_pin: true })
            .eq("user_id", user_id)
            .eq("note_id", note_id);
        if (error) {
            return res.status(404).json({
                status: "failed",
                message: error.message,
            });
        }
        return res.json({
            status: "success",
            message: "note berhasil dipin",
        });
    }
}

async function deletePin(req, res) {
    const { user_id, note_id } = req.params;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong,wajib diisi!"
        });
    }
    if (!note_id) {
        return res.status(404).json({
            status: "failed",
            message: "note id kosong,wajib diisi!"
        });
    }
    const { data, error } = await supabase
        .from("note")
        .select("*")
        .eq("user_id", user_id)
        .eq("note_id", note_id);
    if (data.length === 0) {
        return res.status(404).json({
            status: "failed",
            message: "note id tidak sama, tidak berhasil menambah pin!"
        });
    } else {
        const { data, error } = await supabase
            .from("note")
            .update({ is_pin: false })
            .eq("user_id", user_id)
            .eq("note_id", note_id);
        if (error) {
            return res.status(404).json({
                status: "failed",
                message: error.message,
            });
        }
        return res.json({
            status: "success",
            message: "pin berhasil dihapus",
        });
    }
}

async function addAccount(req, res) {
    const { user_id, username, email, image } = req.body;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong,wajib diisi!"
        });
    }
    if (!username) {
        return res.status(404).json({
            status: "failed",
            message: "username kosong,wajib diisi!"
        });
    }
    if (!email) {
        return res.status(404).json({
            status: "failed",
            message: "email kosong,wajib diisi!"
        });
    }
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
    if (data.length > 0) {
        return res.status(404).json({
            status: "failed",
            message: "akun sudah dibuat!"
        });
    }
    else {
        const { data, error } = await supabase
            .from("users")
            .insert([{ user_id, username, email, image, created_at: new Date().toISOString() }]);
        if (error) {
            return res.status(404).json({
                status: "failed",
                message: error.message,
            });
        }
        return res.json({
            status: "success",
            message: "akun berhasil dibuat!",
        });
    }
}

async function getAccount(req, res) {
    const { user_id } = req.params;
    if (!user_id) {
        return res.status(404).json({
            status: "failed",
            message: "user id kosong,wajib diisi!"
        });
    }
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
    if (error) {
        return res.status(404).json({
            status: "failed",
            message: error.message,
        });
    }
    if (data.length === 0) {
        return res.status(404).json({
            status: "failed",
            message: "akun tidak ditemukan!"
        });
    }
    else {
        return res.json({
            status: "success",
            data: data,
        });
    }
}

module.exports = { welcome, addNote, getNote, getDetailNote, editNote, deleteNote, searchNote, addPin, deletePin, addAccount, getAccount };
let my_worker = this;

self.onmessage = function (event) {
    event.ports[0].postMessage(1);
}

class KernelSyscalls {
    constructor(p) {
        this.p = p; // Objeto de explotación con primitivas R/W
    }

    syscall(num, arg1 = 0, arg2 = 0, arg3 = 0, arg4 = 0, arg5 = 0, arg6 = 0) {
        return this.p.syscall(num, arg1, arg2, arg3, arg4, arg5, arg6);
    }

    kekcall() {
        console.log("Ejecutando syscall: kekcall (0x100000027)");
        return this.syscall(0x100000027);
        showTemporaryAlert("0x100000027");
    }

    kmem_alloc() {
        console.log("Ejecutando syscall: kmem_alloc (0x600000027)");
        let addr = this.syscall(0x600000027);
        return addr | 0xffffff8000000000n;
        showTemporaryAlert("0x600000027");
    }

    kproc_create() {
        console.log("Ejecutando syscall: kproc_create (0x700000027)");
        return this.syscall(0x700000027);
        showTemporaryAlert("0x700000027");
    }

    kstuff_check() {
        console.log("Ejecutando syscall: kstuff_check (0xffffffff00000027)");
        return this.syscall(0xffffffff00000027);
        showTemporaryAlert("0xffffffff00000027");
    }
}

// Supongamos que ya tienes el objeto de explotación listo (p)
const kernel = new KernelSyscalls(p);

console.log("kekcall:", kernel.kekcall());
console.log("kmem_alloc:", kernel.kmem_alloc().toString(16));
console.log("kproc_create:", kernel.kproc_create());
console.log("kstuff_check:", kernel.kstuff_check());


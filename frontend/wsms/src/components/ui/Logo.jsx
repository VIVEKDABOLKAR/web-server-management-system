
const Logo = () => {

    return (
        <div className="h-13 w-15 overflow-hidden rounded-xl border border-slate-200/80  p-0.5 shadow-md ring-1 ring-white/70 dark:border-slate-600/70 ">
            <img
                src="/logo.png"
                alt="WSMS logo"
                className="h-full w-full rounded-[10px] object-cover"
                loading="eager"
            />
        </div>
    )
}

export default Logo;
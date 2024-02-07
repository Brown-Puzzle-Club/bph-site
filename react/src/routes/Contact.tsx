

export default function Contact () {
  return (
    <div className="contact bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">Contact HQ</h1>
      <div className="contact-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
        <div className="contact-box btn-gradient-bot pb-5 ">
          <h4 className="text-xl font-bold pb-5">Before the Hunt</h4>
          <p className="text-slate-400 text-lg">Please email <a href="mailto:puzzle@brown.edu">puzzle@brown.edu</a> with any questions or concerns.</p>
        </div>
        <div className="contact-box pt-5">
          <h4 className="text-xl font-bold pb-5">During the Hunt</h4>
          <p className="text-slate-400 text-lg">We will be running contact and hint requests automatically through our site. These channels of communication will open up once the hunt starts and you are logged in on a team.</p>
        </div>
      </div>
    </div>
  )
}
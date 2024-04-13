export default function Contact() {
  return (
    <div className="contact bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">Contact HQ</h1>
      <div className="contact-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md relative mx-[5%] md:mx-[20%]">
        <div className="contact-box btn-gradient-bot pb-5 ">
          <p className="text-slate-400 text-lg">
            Please email <a href="mailto:brownpuzzleHQ@gmail.com">brownpuzzleHQ@gmail.com</a> for
            any questions, concerns, or interaction.
          </p>
        </div>
      </div>
    </div>
  );
}

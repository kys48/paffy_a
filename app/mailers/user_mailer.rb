class UserMailer < ActionMailer::Base
	default from: "Kwon youngsoo <kys48@mediopia.co.kr>"
  
	def welcome_email(to_email,subject,cont)
		@subject = subject
		puts to_email
		puts @subject
		mail(to: to_email, subject: subject)
	end
end

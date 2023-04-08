from crontab import CronTab
cron = CronTab(user='root')
job = cron.new(command='echo `date` >> /tmp/d/date.txt')
job.minute.every(1)
cron.write()
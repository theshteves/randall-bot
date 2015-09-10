# randall-bot 

### Behind the IRC chat

Once upon a time, a growing online community migrated their chats to the team-messaging app *Slack* after enough random people had ruined their discussions with vulgar language and hateful comments.  These online trolls were reffered to as "cancer" and while the platform migration provided temporary relief, flame wars and spiteful rivalries developed within the new chatroom not to mention moderators getting a little too comfortable with their newfound power to mute and ban others.

### Behind The Bot

What began as an inside joke quickly became an engaging side-project.  Looking for a solution to the aforementioned "cancer," I developed an autonomous bot to oversee a seperate Slack channel reffered to as *the island*.  

On the island where everyday conversation takes place, any user may type the equivalent of "downvote [username]" and that vote is tallied.  With enough downvotes, any user will be kicked and once more if they attempt to join back since they are no longer "on the list."  Of course, users may also summon others that are not on the island with a simple "summon [username]".  As a last counterbalance, there are also upvotes to help preserve contrarians with support.

This bot enforces democracy in the chat by enabling users with a nice polling system.  Sure any slack admin is free to do something at whim but with over 100 active users people are quick to rally support against anyone too unpopular.  If they are kicked they will have no jurisdiction unless they care to jump through enough hoops to delete the chat itself and that obviously is not in their best interest.  By design, the bot executes admin commands through the user_token of the owner of the slack chat so only by his own hand can he kill the chat which would in turn disconnect himself from his own entire active community.

At the end of the day, the island may cultivate a dystopia as any textbook democracy potentially enables but at least the bot removes the power from any one individual.  Soon I will add a tribal leader feature where the most upvoted user at any time will have a couple extra commands at their disposal.  The difference is that this power would only be granted from others.

##### Who is this "randall"?

A fictional character, *randall* is the name for an innocent cloud that circles a map in popular fighting game *Super Smash Brothers Melee* only to catch and essentially save a doomed opponent from their inevitable game over (only on rare occasions).  He is a savior and an enabler that looks over the island and for that we have simply named our auto-moderator bot in honor of him: randall-bot.

![randall](img/randall.jpg)

### Future Updates & Features

Don't worry, they're coming...and they're gonna be *sweet*.

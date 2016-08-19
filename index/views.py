import collections
import json
import os
import pprint

from django.http import HttpResponse
from django.shortcuts import render
from slackclient import SlackClient

from .models import Island

TOKEN = os.environ.get('SLACK_ADMIN_TOKEN')


def index(request):
    return render(request, 'index.html')


def spawn(request):
    '''Spawn an island.'''

    response = collections.OrderedDict()

    if request.GET.get('token') == TOKEN and request.GET.get('channel'):
        slack_client = SlackClient(TOKEN)
        channel_info = slack_client.api_call('channels.info',
                                            channel=request.GET.get('channel'))

        if channel_info.get('ok'):
            ch_name = channel_info.get('channel').get('name')
            ch_id = channel_info.get('channel').get('id')
            Island.objects.get_or_create(name=ch_name, cid=ch_id)

            #TODO: Populate Island w/ it's users

            response = {'ok': 'true', ch_name: ch_id}

        else:
            response = channel_info

    else:
        response = {'ok': 'false', 
                    'error': 'invalid parameters',
                    'request': request.GET.get('token'),
                    'req2': TOKEN}

    return HttpResponse(json.dumps(response, indent=4), \
            content_type='application/json')


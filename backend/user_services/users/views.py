
import requests

from rest_framework.response import Response

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model

# Create your views here.
from rest_framework import permissions, status
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.tokens import RefreshToken

from users.models import AppUser, Notification
from users.serializers import UserRegisterSerializer, UserSerializer, NotificationSerializer
from rest_framework.views import APIView




UserModel = get_user_model()

# Create your views here.
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):

        if AppUser.objects.filter(username=request.data['username']).exists():
            return Response({"error": "Wybrana nazwa użytkownika już istnieje."}, status=status.HTTP_400_BAD_REQUEST)
        if AppUser.objects.filter(email=request.data['email']).exists():
            return Response({"error": "Istnieje już konto powiązane z tym adresem email."}, status=status.HTTP_400_BAD_REQUEST)
        if len(request.data['password']) < 8:
            return Response({"error": "Hasło powinno mieć minimum 8 znaków."}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['password'] != request.data['passwordSecond']:
            return Response({"error": "Hasła nie są ze sobą zgodne."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(request.data)
            user.save()

            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = [permissions.AllowAny,]  # Allow any user to access this view

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        print(request.data)

        errors = {}

        # Ensure both fields are present
        if not email:
            return Response({"error": "Email jest wymagany.", "type": "email"}, status=status.HTTP_400_BAD_REQUEST)

        if not password:
            return Response({"error": "Hasło jest wymagane", "type": "password"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user
        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials", "type": "credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)


class UserLogout(APIView):
    def post(self, request):
        return Response(status=status.HTTP_200_OK)


class OneUserData(APIView):
    permission_classes = (permissions.IsAuthenticated,)  # Only authenticated users can log out
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        profile_picture = request.FILES.get('profile_picture')  # Use 'avatar' as the field name for the image
        if profile_picture:
            user.profile_picture = profile_picture  # Assuming 'avatar' is a field on your User model
            print(profile_picture)
            print(user.profile_picture)
            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No avatar image provided'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        user.email = request.data.get("email")
        user.name = request.data.get("name")
        user.username = request.data.get("username")
        user.telephone = request.data.get("phone")
        user.address = request.data.get("address")
        user.surname = request.data.get("surname")
        user.save()
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class LlamaGenerateView(APIView):
    def get(self, request):
        # Hardcoded reviews (you can change these to any fixed set of reviews)
        wrazenia = {
            "wrazenie_1": "Klimatyczna kawiarnia z ręcznie paloną kawą i pysznym ciastem marchewkowym. Stoliki w ogródku z widokiem na rzekę to świetne miejsce na relaks.",
            "wrazenie_2": "Nowoczesne muzeum z interaktywnymi wystawami – dzieci były zachwycone możliwością dotykania eksponatów!",
            "wrazenie_3": "Nastrojowa knajpka jazzowa z żywą muzyką kilka razy w tygodniu. Drinki wyśmienite, a kelnerzy znają się na winach.",
            "wrazenie_4": "Park linowy w lesie – adrenalina i świetna zabawa dla całej rodziny. Instruktorzy dbają o bezpieczeństwo, a trasy są dla różnych poziomów.",
            "wrazenie_5": "Urokliwa starówka z brukowanymi uliczkami i kolorowymi kamieniczkami. Idealne miejsce na wieczorny spacer z lampkami w tle.",
            "wrazenie_6": "Górska chata z kominkiem i domowym jedzeniem. Po całym dniu wędrówki nic nie smakuje lepiej niż ich pierogi z jagodami!",
            "wrazenie_7": "Plaża z drobnym piaskiem i lazurową wodą. Mało turystów, za to są leżaki i bary z koktajlami.",
            "wrazenie_8": "Zabytkowa fabryka zamieniona w centrum sztuki – street art, koncerty i modne food trucki. Bardzo kreatywna przestrzeń!",
            "wrazenie_9": "Fontanna Mozarta była kulminacyjnym elementem"
        }

        # Sklej wszystkie recenzje do jednego tekstu
        combined_reviews = "\n".join(f"- {text}" for text in wrazenia.values())

        # Prompt do Mistrala
        prompt = f"""Przeczytaj podane opisy miejsc odwiedzonych przez użytkownika i na ich podstawie stwórz krótki opis (2-3 zdania), który może umieścić na portalu społecznościowym jako streszczenie swojej podróży (napisz ciągły tekst, nie używaj numeracji i brzmij jak człowiek):
    {combined_reviews}
    """

        try:
            res = requests.post(
                "http://localhost:11434/api/generate",  # Mistral model endpoint
                json={
                    "model": "mistral",
                    "prompt": prompt,
                    "stream": False
                }
            )
            res.raise_for_status()
            data = res.json()
            return Response({"response": data.get("response", "").strip()})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NotificationsData(APIView):
    permission_classes = (permissions.IsAuthenticated,)  # Only authenticated users can log out

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        num = len(notifications.filter(isRead=False))
        return Response({"notifications": serializer.data, "num": num}, status=status.HTTP_200_OK)

    def patch(self, request, pk=None):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found or you don't have permission"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Only allow updating the 'is_read' field
        if 'is_read' not in request.data:
            return Response(
                {"error": "Only 'isRead' field can be updated"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = NotificationSerializer(
            notification,
            data={'isRead': request.data['isRead']},
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found or you don't have permission"},
                status=status.HTTP_404_NOT_FOUND
            )

        notification.delete()
        return Response(
            {"message": "Notification deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )